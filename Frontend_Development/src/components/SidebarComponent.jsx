import { ChevronFirst, ChevronLast } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            {expanded && <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setExpanded(false)}></div>}
            <aside className={`fixed top-0 left-0 h-screen bg-white border-r shadow-lg z-50 transition-all duration-300 ${expanded ? "w-[250px] " : "w-[70px]"}`}>
                <nav className="h-full flex flex-col">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img src="/src/assets/block.png" width={25} className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`} />
                        <span className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`}>Viniyoga Kavalan</span>
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>
                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>
                    <div className="border-t flex p-3 items-center text-red-400 justify-between">
                        <span className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`}>Log Out</span>
                        <button className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export const SidebarItem = ({ icon, text, to, active }) => {
    const { expanded } = useContext(SidebarContext);
    return (
        <Link to={to}>       
            <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}>
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            </li>
        </Link>
 
    );
};

export default Sidebar;
