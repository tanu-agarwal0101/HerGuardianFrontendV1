"use client";
import Link from "next/link"
import { Button } from "../ui/button"
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";


export default function MobileDrawer({
    onCloseMenu,
    isOpen, handleLogout
}: {
    setSmallMenuOpen?: (open: boolean) => void;
    onCloseMenu: () => void;
    isOpen: boolean;
    handleLogout: () => void;
}) {
    return (
        <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 h-screen bg-white`}
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5 }}
        >
          {/* {1 && (
            <div className="z-60 absolute right-20 top-4">
              hello
            </div>
          )} */}
          <div className="mr-4 mt-4 flex items-center justify-end">
            <Button onClick={onCloseMenu}>
              <X />
            </Button>
          </div>
          <div className="overflow-y-auto pb-20">
            <motion.nav
              className="space-y-2 px-3 py-4"
              // variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                // variants={linkVariants}
                initial={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Link href="/" className="text-lg font-medium text-gray-800">
                  Home
                </Link>
              </motion.div>
              <motion.div
                // variants={linkVariants}
                initial={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link href="/dashboard" className="text-lg font-medium text-gray-800">
                  Dashboard
                </Link>
              </motion.div>
              <motion.div
                // variants={linkVariants}
                initial={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/about" className="text-lg font-medium text-gray-800">
                  About Us
                </Link>
              </motion.div>
              <motion.div
                // variants={linkVariants}
                initial={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href="/profile" className="text-lg font-medium text-gray-800">
                  Profile
                </Link>
              </motion.div>
            </motion.nav>
            <motion.div
              initial={{ opacity: 0, translateY: 100 }}
              animate={{
                opacity: 1,
                translateY: 0,
                transition: { delay: 1.2, ease: 'easeInOut', duration: 1 },
              }}
              className="absolute bottom-0 left-0 right-0 border-gray-100 bg-white p-4"
            >
              
                <Button
                  variant="outline"
                  className="mb-4 w-full rounded-full py-6 text-sm text-black" 
                onClick={handleLogout}
                >
                  {/* <LogOutIcon /> */}
                  Logout
                </Button>
             
              <Button
                variant="outline"
                // onClick={onHelpClick}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-neutral-100 py-6 text-sm font-medium text-black"
              >
                {/* <Hand className="h-4 w-4" /> */}
                <span>I Have a doubt</span>
              </Button>
            </motion.div>
          </div>
          {/* <EditProfileDialog
            isOpen={isEditProfileOpen}
            onClose={onCloseEditProfile}
            userData={userData}
            onSubmit={onSubmitProfile}
          /> */}
        </motion.div>
      )}
    </AnimatePresence>
    )
}