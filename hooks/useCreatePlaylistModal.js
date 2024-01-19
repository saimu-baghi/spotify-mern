import { create } from 'zustand';

const useCreatePlaylistModal = create(set => ({
  isOpen: false,
  onOpen: () => {
    console.log('Opening createPlaylistModal');
    set({ isOpen: true });
  },
  onClose: () => {
    console.log('Closing createPlaylistModal');
    set({ isOpen: false });
  },
}));


export default useCreatePlaylistModal;
