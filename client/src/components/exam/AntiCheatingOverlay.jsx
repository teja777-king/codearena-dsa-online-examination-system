import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, Maximize2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import Button from '../common/Button';

const AntiCheatingOverlay = ({
  attemptId,
  onEventDetected,
  isActive = true,
}) => {
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningTitle, setWarningTitle] = useState('');

  useEffect(() => {
    if (!isActive) return;

    // 1. Tab Switching & Window Focus Change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onEventDetected('tab_switch', 'User switched browser tab or minimized window');
        setWarningTitle('Security Warning: Tab Switch Detected');
        setWarningMessage(
          'You navigated away from the examination window. This action has been logged and reported to the examiner.'
        );
        setWarningModalOpen(true);
      }
    };

    const handleWindowBlur = () => {
      onEventDetected('blur', 'Window lost focus');
    };

    // 2. Fullscreen Exit Detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onEventDetected('fullscreen_exit', 'User exited fullscreen mode');
        setWarningTitle('Security Warning: Fullscreen Exited');
        setWarningMessage(
          'Exiting fullscreen is prohibited during this examination. Please return to fullscreen mode immediately.'
        );
        setWarningModalOpen(true);
      }
    };

    // 3. Prevent Copy, Cut, Paste
    const handleCopy = (e) => {
      e.preventDefault();
      onEventDetected('copy_attempt', 'Attempted to copy exam content');
      setWarningTitle('Action Prohibited');
      setWarningMessage('Copying question text or code is disabled during examination.');
      setWarningModalOpen(true);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      onEventDetected('paste_attempt', 'Attempted to paste content');
    };

    // 4. Prevent Context Menu (Right-Click)
    const handleContextMenu = (e) => {
      e.preventDefault();
      onEventDetected('right_click', 'Attempted right-click context menu');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isActive, onEventDetected]);

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setWarningModalOpen(false);
  };

  return (
    <Modal
      isOpen={warningModalOpen}
      onClose={() => setWarningModalOpen(false)}
      title={warningTitle}
      maxWidth="max-w-md"
      showClose={false}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-slate-300 mb-2 leading-relaxed">{warningMessage}</p>
          <p className="text-xs text-rose-400 font-semibold">
            All anti-cheating incidents are logged to your examination audit record.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="primary"
          size="md"
          onClick={requestFullscreen}
          className="shadow-glow-cyan"
          icon={Maximize2}
        >
          Return to Exam
        </Button>
      </div>
    </Modal>
  );
};

export default AntiCheatingOverlay;
