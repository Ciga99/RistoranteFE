import type React from "react";

export default  function Card({children} : React.PropsWithChildren) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {children}
        </div>
    );
}