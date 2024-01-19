import { create } from 'zustand';

const useAddToPlaylistModal = create((set) => ({
  isOpen: false,
  songId: null,
  onOpen: (songId = null) => set({ isOpen: true, songId }),
  onClose: () => set({ isOpen: false, songId: null }),
}));

export default useAddToPlaylistModal;
