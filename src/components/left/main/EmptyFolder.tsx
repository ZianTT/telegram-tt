import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback } from '../../../lib/teact/teact';
import { withGlobal } from '../../../global';

import type { ApiChatFolder, ApiSticker } from '../../../api/types';
import { SettingsScreens } from '../../../types';
import type { FolderEditDispatch } from '../../../hooks/reducers/useFoldersReducer';

import { selectAnimatedEmoji, selectChatFolder } from '../../../global/selectors';
import useLang from '../../../hooks/useLang';
import useAppLayout from '../../../hooks/useAppLayout';

import Button from '../../ui/Button';
import AnimatedIconFromSticker from '../../common/AnimatedIconFromSticker';

import styles from './EmptyFolder.module.scss';

type OwnProps = {
  folderId?: number;
  folderType: 'all' | 'archived' | 'folder';
  foldersDispatch?: FolderEditDispatch;
  onScreenSelect?: (screen: SettingsScreens) => void;
};

type StateProps = {
  chatFolder?: ApiChatFolder;
  animatedEmoji?: ApiSticker;
};

const ICON_SIZE = 96;

const EmptyFolder: FC<OwnProps & StateProps> = ({
  chatFolder, animatedEmoji, foldersDispatch, onScreenSelect,
}) => {
  const lang = useLang();
  const { isMobile } = useAppLayout();

  const handleEditFolder = useCallback(() => {
    foldersDispatch!({ type: 'editFolder', payload: chatFolder });
    onScreenSelect!(SettingsScreens.FoldersEditFolderFromChatList);
  }, [chatFolder, foldersDispatch, onScreenSelect]);

  return (
    <div className={styles.root}>
      <div className={styles.sticker}>
        {animatedEmoji && <AnimatedIconFromSticker sticker={animatedEmoji} size={ICON_SIZE} />}
      </div>
      <h3 className={styles.title} dir="auto">{lang('FilterNoChatsToDisplay')}</h3>
      <p className={styles.description} dir="auto">
        {lang(chatFolder ? 'ChatList.EmptyChatListFilterText' : 'Chat.EmptyChat')}
      </p>
      {chatFolder && foldersDispatch && onScreenSelect && (
        <Button
          ripple={!isMobile}
          fluid
          pill
          onClick={handleEditFolder}
          size="smaller"
          isRtl={lang.isRtl}
        >
          <i className="icon-settings" />
          <div className={styles.buttonText}>
            {lang('ChatList.EmptyChatListEditFilter')}
          </div>
        </Button>
      )}
    </div>
  );
};

export default memo(withGlobal<OwnProps>((global, { folderId, folderType }): StateProps => {
  const chatFolder = folderId && folderType === 'folder' ? selectChatFolder(global, folderId) : undefined;

  return {
    chatFolder,
    animatedEmoji: selectAnimatedEmoji(global, '📂'),
  };
})(EmptyFolder));
