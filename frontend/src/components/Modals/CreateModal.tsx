import { modalTitles } from "../../Constants/Constants";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideModal } from "../../reducers/createModalReducers";
import ModalContainer from "./ModalContainer";

type createModal = {
    show: boolean;
    children: React.ReactNode;
    createFunction: () => void;
};

function CreateModal({ children, show, createFunction }: createModal) {
    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);

    const handleClosing = () => dispatch(hideModal());

    if (show === false) {
        return null;
    }

    const currentModal = Object.keys(createModalState).find(
        (k) => createModalState[k as keyof typeof createModalState]
    );

    const title: string = `Create ${modalTitles[currentModal as keyof typeof modalTitles]}`;

    const handleCreate = () => {
        createFunction();
        handleClosing();
    };

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            {children}
            <span className="formDivider"></span>
            <div className="self-end flex gap-x-2">
                <button type="reset" className="formBtn formBtnSecondary" onClick={handleClosing}>
                    <p>Cancel</p>
                </button>
                <button className="formBtn formBtnPrimary" onClick={() => handleCreate()}>
                    <p>Create</p>
                </button>
            </div>
        </ModalContainer>
    );
}

export default CreateModal;
