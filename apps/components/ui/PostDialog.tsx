import React from 'react';

interface PostDialogProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (blogId: string, content: string) => Promise<void>;
}

const PostDialog: React.FC<PostDialogProps> = ({ postId, isOpen, onClose, onAddComment }) => {
  // Component implementation
};

export default PostDialog; 