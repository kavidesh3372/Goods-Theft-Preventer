import { useState } from "react";
import { addRfid } from "/src/service/RfidService";
import Calendar from "/src/components/CalenderComponent";

const InputField = ({ label, value, setValue, isFocused, setIsFocused, error }) => (
    <div className="mb-1">
        <div className={`border rounded-lg p-3 pt-5 relative ${error ? "border-red-500" : "border-gray-400"}`}>
            <label
                className={`absolute left-3 px-1 text-sm transition-all bg-white ${
                    isFocused || value ? "-top-3 text-blue-500 text-xs" : "top-4 text-gray-500"
                }`}
            >
                {label}
            </label>
            <input
                type="text"
                className="w-full bg-transparent outline-none"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
        </div>
        {error && <p className="text-sm text-red-600 mt-1 ml-1">{error}</p>}
    </div>
);

const EntryData = () => {
    const [RFIDValue, setRFIDValue] = useState("");
    const [RFIDIsFocused, setRFIDIsFocused] = useState(false);

    const [commodityValue, setCommodityValue] = useState("");
    const [commodityIsFocused, setCommodityIsFocused] = useState(false);

    const [DateValue, setDateValue] = useState("");
    const [DateIsFocused, setDateIsFocused] = useState(false);

    const [expiringDateValue, setExpiringDateValue] = useState("");
    const [expiringDateIsFocused, setExpiringDateIsFocused] = useState(false);

    const [errors, setErrors] = useState({});

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const handleAddRfid = async () => {
        const newErrors = {};

        if (!RFIDValue) newErrors.RFID = "RFID is required";
        if (!commodityValue) newErrors.commodity = "Commodity is required";
        if (!DateValue) newErrors.manufacturingDate = "Manufacturing date is required";
        if (!expiringDateValue) newErrors.expiringDate = "Expiring date is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const rfidData = {
            uid: RFIDValue,
            commodity: commodityValue,
            manufacturingDate: formatDate(DateValue),
            expiringDate: formatDate(expiringDateValue),
            status: "Available",
        };

        try {
            const response = await addRfid(rfidData);
            if (response.status === 200) {
                alert("RFID added successfully!");
               
            } else {
                alert("Failed to add data. Please try again.");
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response) {
                alert(error.response.data.message || "Error adding RFID.");
            } else if (error.request) {
                alert("No response from server. Check your backend.");
            } else {
                alert("Error: " + error.message);
            }
        }
    };

    return (
        <form className="ml-10 p-5">
            <h3 className="text-xl font-bold mb-5">RFID Entry Form</h3>
            <div className="gap-10">
                <div className="flex flex-row flex-wrap gap-10 mb-10">
                    <div className="w-1/3">
                        <InputField
                            label="RFID"
                            value={RFIDValue}
                            setValue={setRFIDValue}
                            isFocused={RFIDIsFocused}
                            setIsFocused={setRFIDIsFocused}
                            error={errors.RFID}
                        />
                    </div>

                    <div className="w-1/3">
                        <div className="mb-1">
                            <div className={`border rounded-lg p-3 pt-5 relative ${errors.commodity ? "border-red-500" : "border-gray-400"}`}>
                                <label
                                    className={`absolute left-3 px-1 text-sm transition-all bg-white ${
                                        commodityIsFocused || commodityValue
                                            ? "-top-3 text-blue-500 text-xs"
                                            : "top-4 text-gray-500"
                                    }`}
                                >
                                    Commodity
                                </label>
                                <select
                                    value={commodityValue}
                                    onChange={(e) => setCommodityValue(e.target.value)}
                                    onFocus={() => setCommodityIsFocused(true)}
                                    onBlur={() => setCommodityIsFocused(false)}
                                    className="w-full bg-transparent outline-none text-black"
                                >
                                    <option value="" disabled hidden></option>
                                    <option value="Rice">Rice</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Dal">Dal</option>
                                    <option value="Sugar">Sugar</option>
                                    <option value="Kerosene">Kerosene</option>
                                </select>
                            </div>
                            {errors.commodity && <p className="text-sm text-red-600 mt-1 ml-1">{errors.commodity}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-10 mb-10">
                    <div className="w-1/3">
                        <InputField
                            label="Manufacturing Date"
                            value={DateValue}
                            setValue={setDateValue}
                            isFocused={DateIsFocused}
                            setIsFocused={setDateIsFocused}
                            error={errors.manufacturingDate}
                        />
                        <Calendar selectedDate={DateValue} setSelectedDate={setDateValue} />
                    </div>
                    <div className="w-1/3">
                        <InputField
                            label="Expiring Date"
                            value={expiringDateValue}
                            setValue={setExpiringDateValue}
                            isFocused={expiringDateIsFocused}
                            setIsFocused={setExpiringDateIsFocused}
                            error={errors.expiringDate}
                        />
                        <Calendar selectedDate={expiringDateValue} setSelectedDate={setExpiringDateValue} />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleAddRfid}
                    className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black"
                >
                    Submit RFID
                </button>
            </div>
        </form>
    );
};

export default EntryData;