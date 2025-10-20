import Button from "./Button"

type ModelType = {
    title: string,
    isOpen: boolean,
    onClickClose: () => void,
    onClickSubmit?: () => void,
    children: React.ReactNode
}

const Model = ({
    title,
    isOpen,
    onClickClose,
    onClickSubmit = undefined,
    children
}: ModelType) => {
    return (
        <>
            {isOpen && (
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center items-center p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title}</h3>
                                            <div className="mt-5">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <div className="mx-1">
                                        {onClickSubmit && (
                                            <Button onClick={() => {onClickSubmit(); onClickClose();}}>Submit</Button>
                                        )}
                                    </div>
                                    <Button onClick={onClickClose}>{(onClickSubmit === undefined) ? "Okay" : "Close"}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Model