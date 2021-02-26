import React from 'react';
import AskModal from '../../../utils/Modal/AskModal';

function AskRemoveModal({ visible, onCancel, onConfirm }) {
    return (
        <div>
            <AskModal visible={visible} onConfirm={onConfirm} onCancel={onCancel} title="삭제">
                <p>정말로 해당 계좌를 삭제하시겠습니까?</p>
            </AskModal>
        </div>
    );
}

export default AskRemoveModal;
