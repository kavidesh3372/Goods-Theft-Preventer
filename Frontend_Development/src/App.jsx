import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import DashBoard from "./components/DashboardComponent";
import GPSMap from "./components/TrackingComponent";
import Sidebar, { SidebarItem } from "./components/SidebarComponent";
import { LayoutDashboard, Boxes, MapPinned, ArrowRightLeft,IdCard,Bolt, Info } from "lucide-react";
import CombinedComponent from "./components/InventoryComponent";
import EntryData from "./components/EntryComponenet";
import Transaction from "./components/TransactionComponent";
import EmbeddedMap from "./components/TrackingComponent";

function App() {
    return (
        <BrowserRouter>
            <div className="relative h-screen">
                <Sidebar>
                    <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to='/'/>
                    <SidebarItem icon={<MapPinned size={20} />} text="Tracking"  to='/gps'/>
                    <SidebarItem icon={<Boxes size={20} />} text="Inventory" to='/inventory'/>
                    <SidebarItem icon={<IdCard size={20} />} text="RFIDTag" to='/add'/>
                    <SidebarItem icon={<ArrowRightLeft size={20} />} text="Transaction" to='/transaction' />
                    <SidebarItem icon={<Bolt size={20} />} text="Setting" to='/emb'/>
                    <SidebarItem icon={<Info size={20} />} text="Help" to=''/>
                </Sidebar>
                <div className="p-5">
                  <Routes>
                      <Route path="/" element={<DashBoard />} />
                      <Route path="/gps" element={<GPSMap />} />
                      <Route path="/inventory" element={<CombinedComponent />}></Route>
                      <Route path="/add" element={<EntryData />}></Route>
                      <Route path="/transaction" element={<Transaction />}></Route>
                      <Route path="/emb" element={<EmbeddedMap />}></Route>
                  </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
