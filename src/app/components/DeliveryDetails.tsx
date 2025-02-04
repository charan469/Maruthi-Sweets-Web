// components/DeliveryDetails.tsx
interface DeliveryDetailsProps {
    customerName: string;
    mobileNumber: string;
    selectedCity: string;
    selectedDeliveryPoint: string;
    deliveryDate: string;
    setCustomerName: (name: string) => void;
    setMobileNumber: (number: string) => void;
    setSelectedCity: (city: string) => void;
    setSelectedDeliveryPoint: (point: string) => void;
    setDeliveryDate: (date: string) => void;
    cities: { name: string; deliveryPoints: string[] }[];
  }
  
  const DeliveryDetails = ({
    customerName,
    mobileNumber,
    selectedCity,
    selectedDeliveryPoint,
    deliveryDate,
    setCustomerName,
    setMobileNumber,
    setSelectedCity,
    setSelectedDeliveryPoint,
    setDeliveryDate,
    cities,
  }: DeliveryDetailsProps) => {
    return (
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {selectedCity && (
          <select
            value={selectedDeliveryPoint}
            onChange={(e) => setSelectedDeliveryPoint(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
          >
            <option value="">Select Delivery Point</option>
            {cities
              .find((city) => city.name === selectedCity)
              ?.deliveryPoints.map((point) => (
                <option key={point} value={point}>
                  {point}
                </option>
              ))}
          </select>
        )}
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
    );
  };
  
  export default DeliveryDetails;
  