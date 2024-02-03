import React from "react";

interface Props {
    children: React.ReactElement<HTMLElement>;
}
export const EmailLinkToCopy: React.FC<Props> = ({children}) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleClick = (e: any) => {
        navigator.clipboard.writeText("info@aitorevi.dev");
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }
    const ClipBoardChecked = () => {
        return (
            <div className="relative px-1 py-0.5">
                <p>Copiado al portapapeles</p>
            </div>
        )
    }
    return (
        <>
            <button onClick={handleClick} className="relative">
                {children}
            </button>
            <div className="absolute w-20 bg-primary bg-opacity-60 text-tertiary text-xs text-center rounded-md -mt-14 ml-4">
                {isCopied ? <ClipBoardChecked /> : ""}
            </div>
        </>
    );
}