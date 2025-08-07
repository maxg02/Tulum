import { modalTitles } from "../../Constants/Constants";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideModal } from "../../reducers/createModalReducers";
import { useState } from "react";
import ModalContainer from "./ModalContainer";

type createModal = {
    show: boolean;
    children: React.ReactNode;
    createFunction: () => Promise<void>;
};

function CreateModal({ children, show, createFunction }: createModal) {
    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const [error, setError] = useState<string | null>(null);

    const handleClosing = () => {
        setError(null);
        dispatch(hideModal());
    };

    if (show === false) {
        return null;
    }

    const currentModal = Object.keys(createModalState).find(
        (k) => createModalState[k as keyof typeof createModalState]
    );

    const title: string = `Create ${modalTitles[currentModal as keyof typeof modalTitles]}`;

    const handleCreate = () => {
        createFunction()
            .then(() => handleClosing())
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            {children}
            {error && (
                <div role="alert">
                    {error.split(",").map((e, key) => (
                        <p key={key} className="text-red-400 mb-0">
                            {e}
                        </p>
                    ))}
                </div>
            )}
            <hr className="customDivider"></hr>
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
