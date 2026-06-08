import { prisma } from '../config/db.js';

export interface CreateMessageData {
  type: 'text' | 'image';
  text_content?: string;
  hex_black_array?: string;
  hex_red_array?: string;
}

export const messageRepository = {
  /**
   * Menyimpan pesan baru. Jika ada pesan yang masih 'pending',
   * statusnya akan diubah menjadi 'superseded' terlebih dahulu.
   */
  async createMessage(data: CreateMessageData) {
    return prisma.$transaction(async (tx: any) => {
      // 1. Ubah semua pesan yang masih 'pending' menjadi 'superseded'
      await tx.message.updateMany({
        where: { status: 'pending' },
        data: { status: 'superseded' },
      });

      // 2. Buat pesan baru dengan status default 'pending'
      const newMessage = await tx.message.create({
        data,
      });

      return newMessage;
    });
  },

  /**
   * Mengambil satu pesan terbaru yang berstatus 'pending'.
   */
  async getLatestPendingMessage() {
    return prisma.message.findFirst({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' },
    });
  },

  /**
   * Memperbarui status pesan menjadi 'delivered'
   */
  async markAsDelivered(id: number) {
    return prisma.message.update({
      where: { id },
      data: { status: 'delivered' },
    });
  }
};
