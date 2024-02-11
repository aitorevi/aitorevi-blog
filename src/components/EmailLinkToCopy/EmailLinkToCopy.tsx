import React from "react";

interface Props {
    children: React.ReactElement<HTMLElement>;
    position?: "navbar" | "footer";
}

export const EmailLinkToCopy: React.FC<Props> = ({children, position="footer"}) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const dictionary = {
        navbar: "mt-6 ml-24 md:mt-8 ml-24",
        footer: "-mt-10 ml-30 md:-mt-12 md:ml-40",
    }
    const stylesPosition = dictionary[position];
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
                <p>Copiado</p>
            </div>
        )
    }
    return (
        <>
            <button onClick={handleClick} className="relative">
                {children}
            </button>
            <div className={`absolute w-16 bg-primary bg-opacity-60 text-tertiary text-xs text-center rounded-md ${dictionary[position]}`}>
                {isCopied ? <ClipBoardChecked /> : ""}
            </div>
        </>
    );
}