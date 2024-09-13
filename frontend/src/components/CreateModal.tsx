import { useAppDispatch, useAppSelector } from "../hooks";
import { hideModal } from "../reducers/createModalReducers";
import ModalContainer from "./ModalContainer";

type createModal = {
    show: boolean;
    children: React.ReactNode;
    createFunction: () => void;
};

function CreateModal({ children, show, createFunction }: createModal) {
    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);

    const currentModal = Object.keys(createModalState).filter((k) => createModalState[k]);

    let title: string = "";

    switch (currentModal[0]) {
        case "income":
            title = "Create Income";
            break;
        case "fixedIncome":
            title = "Fixed Income";
            break;
    }

    //const title = useAppSelector((state) => state.createModal.title);

    const handleClosing = () => dispatch(hideModal());

    const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault;
        createFunction();
    };

    if (show === false) {
        return null;
    }

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            {children}
            <span className="formDivider"></span>
            <div className="self-end flex gap-x-2">
                <button type="reset" className="formButton" onClick={handleClosing}>
                    <p>Cancel</p>
                </button>
                <button className="formButton" onClick={(event) => handleCreate(event)}>
                    <p>Create</p>
                </button>
            </div>
        </ModalContainer>
    );
}

export default CreateModal;
