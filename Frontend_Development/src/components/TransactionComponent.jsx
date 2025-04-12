import { useState } from "react";
import { transactionInventory } from "/src/service/InventoryService";
import { PlusCircle, Trash2 } from "lucide-react";
import PopupMessage from "./PopUpMessageComponent";

const InputField = ({ label, value, setValue, type = "text", error }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="mb-2">
            <div className="border border-gray-400 rounded-lg p-3 pt-5 relative">
                <label
                    className={`absolute left-3 px-1 text-sm transition-all ${
                        isFocused || value
                            ? "-top-3 text-blue-500 text-xs bg-white"
                            : "top-4 text-gray-500"
                    }`}
                >
                    {label}
                </label>
                <input
                    type={type}
                    className="w-full bg-transparent outline-none"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

const AddressInputField = ({ label, value, setValue, error }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="mb-2">
            <div className="border border-gray-400 rounded-lg p-3 pt-5 relative">
                <label
                    className={`absolute left-3 px-1 text-sm transition-all ${
                        isFocused || value
                            ? "-top-3 text-blue-500 text-xs bg-white"
                            : "top-4 text-gray-500"
                    }`}
                >
                    {label}
                </label>
                <textarea
                    rows={3}
                    style={{ resize: "none" }}
                    className="w-full bg-transparent outline-none"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

const Transaction = () => {
    const [shopValue, setShopValue] = useState("");
    const [destinationValue, setDestinationValue] = useState("");
    const [vanIdValue, setVanIdValue] = useState("");

    const [commodities, setCommodities] = useState([""]);
    const [quantities, setQuantities] = useState([""]);

    const [errors, setErrors] = useState({});
    const [popup, setPopup] = useState({ message: "", type: "" });

    const showPopup = (message, type = "info") => {
        setPopup({ message, type });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!vanIdValue) newErrors.vanIdValue = "Van ID is required.";
        if (!shopValue) newErrors.shopValue = "Shop ID is required.";
        if (!destinationValue) newErrors.destinationValue = "Destination is required.";

        commodities.forEach((c, index) => {
            if (!c) newErrors[`commodity-${index}`] = "Commodity is required.";
        });

        quantities.forEach((q, index) => {
            if (!q) newErrors[`quantity-${index}`] = "Quantity is required.";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addCommodity = () => {
        setCommodities([...commodities, ""]);
        setQuantities([...quantities, ""]);
    };

    const removeCommodity = (index) => {
        setCommodities(commodities.filter((_, i) => i !== index));
        setQuantities(quantities.filter((_, i) => i !== index));
    };

    const handleCommodityChange = (index, value) => {
        const updated = [...commodities];
        updated[index] = value;
        setCommodities(updated);
    };

    const handleQuantityChange = (index, value) => {
        const updated = [...quantities];
        updated[index] = value;
        setQuantities(updated);
    };

    const handleTransaction = async () => {
        if (!validateForm()) {
            return;
        }

        const transferData = {
            shopId: shopValue,
            vanId: vanIdValue,
            destination: destinationValue,
            commodities,
            quantities: quantities.map(Number),
        };

        try {
            const response = await transactionInventory(transferData);
            if (response.status === 200) {
                showPopup(response.data.message, "success");
                setShopValue("");
                setVanIdValue("");
                setDestinationValue("");
                setCommodities([""]);
                setQuantities([""]);
                setErrors({});
            }
        } catch (error) {
            console.error("Transaction error:", error);
            showPopup(error.response?.data?.error || "Transaction failed.", "error");
        }
    };

    return (
        <div className="ml-10 p-5">
            <h3 className="text-xl font-bold mb-5">Transaction</h3>

            {/* Van ID and Shop ID Fields */}
            <div className="flex flex-wrap gap-10 mb-10">
                <div className="w-1/3">
                    <InputField
                        label="Van ID"
                        value={vanIdValue}
                        setValue={setVanIdValue}
                        error={errors.vanIdValue}
                    />
                </div>
                <div className="w-1/3">
                    <InputField
                        label="Shop ID"
                        value={shopValue}
                        setValue={setShopValue}
                        error={errors.shopValue}
                    />
                </div>
            </div>

            {/* Commodities Section */}
            <div className="mb-10">
                <h4 className="font-bold mb-3">Commodities</h4>
                {commodities.map((item, index) => (
                    <div key={index} className="flex items-center gap-5 mb-3">
                        <div className="w-1/3">
                            <InputField
                                label="Commodity"
                                value={item}
                                setValue={(value) => handleCommodityChange(index, value)}
                                error={errors[`commodity-${index}`]}
                            />
                        </div>
                        <div className="w-1/4">
                            <InputField
                                label="Quantity"
                                value={quantities[index]}
                                setValue={(value) => handleQuantityChange(index, value)}
                                type="number"
                                error={errors[`quantity-${index}`]}
                            />
                        </div>
                        {commodities.length > 1 && (
                            <button onClick={() => removeCommodity(index)} className="text-red-500">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addCommodity} className="flex items-center gap-2 text-blue-500 mt-2">
                    <PlusCircle size={20} /> Add Commodity
                </button>
            </div>

            {/* Destination */}
            <div className="flex flex-wrap gap-10 mb-10">
                <div className="w-1/2">
                    <AddressInputField
                        label="Destination"
                        value={destinationValue}
                        setValue={setDestinationValue}
                        error={errors.destinationValue}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="button"
                onClick={handleTransaction}
                className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black"
            >
                Submit
            </button>

            {/* Popup */}
            {popup.message && (
                <PopupMessage
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup({ message: "", type: "" })}
                />
            )}
        </div>
    );
};

export default Transaction;
