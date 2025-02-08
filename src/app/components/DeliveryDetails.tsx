// components/DeliveryDetails.tsx
interface DeliveryDetailsProps {
  customerName: string;
  mobileNumber: string;
  selectedCity: string;
  selectedDeliveryPoint: string;
  deliveryDate: string;
  getMinDeliveryDate: () => string;
  setCustomerName: (name: string) => void;
  setMobileNumber: (number: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedDeliveryPoint: (point: string) => void;
  setDeliveryDate: (date: string) => void;
  cities: { name: string; deliveryPoints: string[], deliveryCharges: number }[];
  deliveryCharges: number;
  setDeliveryCharges: (number: number) => void;
  itemsPrice: number
}

const DeliveryDetails = ({
  customerName,
  mobileNumber,
  selectedCity,
  selectedDeliveryPoint,
  deliveryDate,
  getMinDeliveryDate,
  setCustomerName,
  setMobileNumber,
  setSelectedCity,
  setSelectedDeliveryPoint,
  setDeliveryDate,
  cities,
  deliveryCharges,
  setDeliveryCharges,
  itemsPrice
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
        value={selectedCity} // selectedCity stores the name
        onChange={(e) => {
          const cityName = e.target.value;
          setSelectedCity(cityName);
          // Find the city object based on the name and set delivery charges
          const city = cities.find((each) => each.name === cityName);
          setDeliveryCharges(city?.deliveryCharges || 0); // Default to 0 if city is not found
        }}
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
        min={getMinDeliveryDate()} // Lock to at least 48 hours later
        onChange={(e) => setDeliveryDate(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      {deliveryCharges !== 0 &&
        <div className="flex f-row justify-between pt-4"><h2 className="font-bold">items cost: </h2> <p>Rs.{itemsPrice}</p></div>
      }
      {deliveryCharges !== 0 &&
        <div className="flex f-row justify-between pt-4"><h2 className="font-bold">Delivery Charges: </h2> <p>Rs.{deliveryCharges}</p></div>
      }
    </div>
  );
};

export default DeliveryDetails;
