-- AddForeignKey
ALTER TABLE `quote_items` ADD CONSTRAINT `quote_items_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
