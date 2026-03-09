import { AnimatePresence, motion } from 'framer-motion';
import FilterSidebar from './FilterSidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hideCategoryFilter?: boolean;
}

export default function FilterSheet({ isOpen, onClose, hideCategoryFilter }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary rounded-t-2xl max-h-[80vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="p-4">
              <FilterSidebar onClose={onClose} hideCategoryFilter={hideCategoryFilter} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
