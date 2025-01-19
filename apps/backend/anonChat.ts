import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  socket: WebSocket;
  preferences: {
    interests?: string[];
    language?: string;
    ageRange?: {
      min: number;
      max: number;
    };
  };
}

interface ChatRoom {
  user1: User;
  user2: User;
}

interface WSMessage {
  type: 'joinQueue' | 'chatMessage' | 'skip';
  data: any;
}

class AnonChat {
  private waitingUsers: User[] = [];
  private activeChats: Map<string, ChatRoom> = new Map();
  private wss: WebSocket.Server;

  constructor(server: any) {
    this.wss = new WebSocket.Server({ server });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const userId = uuidv4();
      console.log('User connected:', userId);

      ws.on('message', (message: string) => {
        try {
          const parsedMessage: WSMessage = JSON.parse(message.toString());
          this.handleMessage(userId, ws, parsedMessage);
        } catch (error) {
          this.sendToClient(ws, 'error', 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(userId);
      });
    });
  }

  private handleMessage(userId: string, ws: WebSocket, message: WSMessage) {
    switch (message.type) {
      case 'joinQueue':
        this.addToQueue(userId, ws, message.data.preferences);
        break;
      case 'chatMessage':
        this.handleChatMessage(userId, message.data.message);
        break;
      case 'skip':
        this.handleSkip(userId);
        break;
      default:
        this.sendToClient(ws, 'error', 'Unknown message type');
    }
  }

  private sendToClient(ws: WebSocket, type: string, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data }));
    }
  }

  private addToQueue(userId: string, ws: WebSocket, preferences: User['preferences']) {
    // Remove user from any existing chat
    this.removeFromChat(userId);

    // Add user to waiting queue
    const newUser: User = { id: userId, socket: ws, preferences };
    this.waitingUsers.push(newUser);

    // Notify user they're in queue
    this.sendToClient(ws, 'queueStatus', { status: 'waiting' });

    // Try to match with another user
    this.tryMatch(newUser);
  }

  private tryMatch(user: User) {
    const match = this.findMatch(user);
    if (match) {
      // Remove both users from waiting queue
      this.waitingUsers = this.waitingUsers.filter(
        u => u.id !== user.id && u.id !== match.id
      );

      // Create new chat room
      const roomId = `${user.id}-${match.id}`;
      this.activeChats.set(roomId, {
        user1: user,
        user2: match,
      });

      // Notify both users
      this.sendToClient(user.socket, 'chatStarted', { roomId });
      this.sendToClient(match.socket, 'chatStarted', { roomId });
    }
  }

  private findMatch(user: User): User | null {
    return this.waitingUsers.find(potentialMatch => {
      if (potentialMatch.id === user.id) return false;
      return this.arePreferencesCompatible(user.preferences, potentialMatch.preferences);
    }) || null;
  }

  private arePreferencesCompatible(pref1: User['preferences'], pref2: User['preferences']): boolean {
    // Implement your matching logic here
    // Example: Check for common interests
    if (pref1.interests && pref2.interests) {
      const commonInterests = pref1.interests.some(interest => 
        pref2.interests?.includes(interest)
      );
      if (!commonInterests) return false;
    }

    // Check language preference
    if (pref1.language && pref2.language && pref1.language !== pref2.language) {
      return false;
    }

    return true;
  }

  private handleChatMessage(userId: string, message: string) {
    const room = this.findRoomByUserId(userId);
    if (room) {
      const sender = room.user1.id === userId ? room.user1 : room.user2;
      const recipient = room.user1.id === userId ? room.user2 : room.user1;
      this.sendToClient(recipient.socket, 'chatMessage', { message });
    }
  }

  private handleDisconnect(userId: string) {
    this.removeFromChat(userId);
    this.waitingUsers = this.waitingUsers.filter(u => u.id !== userId);
  }

  private handleSkip(userId: string) {
    this.removeFromChat(userId);
  }

  private removeFromChat(userId: string) {
    const room = this.findRoomByUserId(userId);
    if (room) {
      const otherUser = room.user1.id === userId ? room.user2 : room.user1;
      this.sendToClient(otherUser.socket, 'chatEnded', { reason: 'Partner left' });
      
      // Remove the chat room
      for (const [roomId, chatRoom] of this.activeChats.entries()) {
        if (chatRoom.user1.id === userId || chatRoom.user2.id === userId) {
          this.activeChats.delete(roomId);
          break;
        }
      }
    }
  }

  private findRoomByUserId(userId: string): ChatRoom | null {
    for (const room of this.activeChats.values()) {
      if (room.user1.id === userId || room.user2.id === userId) {
        return room;
      }
    }
    return null;
  }

  cleanup() {
    // Close all WebSocket connections
    this.wss.clients.forEach(client => {
      client.close();
    });
    this.wss.close();
  }
}

export default AnonChat;
