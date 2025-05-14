import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";

const Addinvoice = () => {
  const [formData, setFormData] = useState({
    billBranch: '',
    buyerBill: '',
    invoiceNumber: '',
    deliveryNote: '',
    referenceNoDate: '',
    buyerOrderNo: '',
    dispatchNo: '',
    dispatchThrough: '',
    date: '',
    paymentMode: '',
    paymentRef: '',
    dated: '',
    deliveryNotedate: '',
    destination: '',
    termOfDelivery: '',
    discount: '',
    igst: '',
    cgst: '',
    sgst: '',
  });


  const [rows, setRows] = useState([
    {
      srNo: 1,
      productName: '',
      hsnNo: '',
      totalQuantity: '',
      productPrice: '',
      totalSalePrice: '',
    },
  ]);

  const [bankdetail, setbankdetail] = useState(true);
  const [SelectedBillingAddress, setSelectedBillingAddress] = useState(null)
  const [uniqueAddresses2, setUniqueAddresses2] = useState([
    {
      _id: "1",
      Name: "Ajay Kumar",
      accountNumber: "123456789",
      bankName: "State Bank of India",
      ifscCode: "SBIN0000001",
      branch: "MG Road",
      swiftcode: "SBININBBXXX",
    },
    {
      _id: "1",
      Name: "Ajay Kumar",
      accountNumber: "123456789",
      bankName: "State Bank of India",
      ifscCode: "SBIN0000001",
      branch: "MG Road",
      swiftcode: "SBININBBXXX",
    },
  ]);

  const handleSelectBilling = (index) => {
    setSelectedBillingAddress({ addressBillingIndex: index });
  };
  const [invoice] = useState({
    billBranch: 'Branch Name',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;


    if (name === "productPrice" || name === "totalQuantity") {
      const quantity = Number(updatedRows[index].totalQuantity || 0);
      const price = Number(updatedRows[index].productPrice || 0);
      updatedRows[index].totalSalePrice = quantity * price;
    }

    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        srNo: prevRows.length + 1,
        productName: '',
        hsnNo: '',
        totalQuantity: '',
        productPrice: '',
        totalSalePrice: '',
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index).map((row, i) => ({
      ...row,
      srNo: i + 1,
    }));
    setRows(updatedRows);
  };




  const calculateNetTotal = () => {
    const subtotal = rows.reduce((acc, row) => acc + Number(row.totalSalePrice || 0), 0);
    const discount = Number(formData.discount || 0);
    const igst = Number(formData.igst || 0);
    const cgst = Number(formData.cgst || 0);
    const sgst = Number(formData.sgst || 0);

    const afterDiscount = subtotal - discount;
    const gstAmount =
      afterDiscount * (igst + cgst + sgst) / 100;

    const netTotal = afterDiscount + gstAmount;
    return netTotal.toFixed(2);
  };



  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <div className="ml-60 mt-16 p-6 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100">
          <h1 className="text-center text-xl font-bold mb-6">Tax Invoice</h1>


          <div className="flex flex-col md:flex-row justify-between border p-4 mb-4 gap-6">
            <div className="space-y-4 w-full md:w-1/2">
              <input
                type="text"
                name="billBranch"
                value={formData.billBranch}
                onChange={handleChange}
                placeholder="Enter Bill Branch"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              <input
                type="text"
                name="buyerBill"
                value={formData.buyerBill}
                onChange={handleChange}
                placeholder="Buyer Bill To"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  ['invoiceNumber', 'Invoice No.'],
                  ['deliveryNote', 'Delivery Note'],
                  ['referenceNoDate', 'Reference No. Date'],
                  ['buyerOrderNo', 'Buyer Order No.'],
                  ['dispatchNo', 'Dispatch Doc No.'],
                  ['dispatchThrough', 'Dispatch Through'],
                ].map(([name, placeholder]) => (
                  <input
                    key={name}
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  ['date', 'Date'],
                  ['paymentMode', 'Payment Mode'],
                  ['paymentRef', 'Payment Ref'],
                  ['dated', 'Dated'],
                  ['deliveryNotedate', 'Delivery Note Date'],
                  ['destination', 'Destination'],
                ].map(([name, placeholder]) => (
                  <input
                    key={name}
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                ))}
              </div>

              <input
                type="text"
                name="termOfDelivery"
                value={formData.termOfDelivery}
                onChange={handleChange}
                placeholder="Term of Delivery"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>


          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sr No</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">HSN/SAC</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total Price</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {[
                    ['srNo', 'text'],
                    ['productName', 'text'],
                    ['hsnNo', 'text'],
                    ['totalQuantity', 'number'],
                    ['productPrice', 'number'],
                    ['totalSalePrice', 'number'],
                  ].map(([name, type]) => (
                    <td key={name} className="border p-2">
                      <input
                        type={type}
                        name={name}
                        value={row[name]}
                        onChange={(e) => handleRowChange(index, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        disabled={name === 'srNo' || name === 'totalSalePrice'}
                      />
                    </td>
                  ))}
                  <td className="border p-2 text-center">
                    <button
                      onClick={handleAddRow}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>


            <tr>
              <td colSpan="5" className="text-right font-semibold p-2 border">
                Subtotal
              </td>
              <td className="border p-2 font-semibold">
                ₹{rows.reduce((acc, row) => acc + Number(row.totalSalePrice || 0), 0).toFixed(2)}
              </td>
              <td className="border p-2"></td>
            </tr>


            <tfoot>

              <tr>
                <td colSpan="5" className="text-right font-semibold p-2 border">
                  Discount
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="₹ Discount"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </td>
              </tr>


              <tr>
                <td colSpan="5" className="text-right font-semibold p-2 border">
                  IGST (%)
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name="igst"
                    value={formData.igst || ''}
                    onChange={handleChange}
                    placeholder="IGST %"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </td>
              </tr>


              <tr>
                <td colSpan="5" className="text-right font-semibold p-2 border">
                  CGST (%)
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name="cgst"
                    value={formData.cgst || ''}
                    onChange={handleChange}
                    placeholder="CGST %"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </td>
              </tr>


              <tr>
                <td colSpan="5" className="text-right font-semibold p-2 border">
                  SGST (%)
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name="sgst"
                    value={formData.sgst || ''}
                    onChange={handleChange}
                    placeholder="SGST %"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </td>
              </tr>


              <tr>
                <td colSpan="5" className="text-right font-bold p-2 border bg-gray-100">
                  Net Total
                </td>
                <td className="border p-2 font-bold bg-gray-100">
                  ₹{calculateNetTotal()}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="max-w-5xl mx-auto p-6">
            <div className="mt-10 border p-4 rounded-md shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-4">Bank Details</h2>


              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  className="form-check-input mr-2"
                  id="flexSwitchCheckDefault"
                  checked={bankdetail}
                  onChange={() => setbankdetail((prev) => !prev)}
                />
                <label htmlFor="flexSwitchCheckDefault" className="text-sm">
                  Is your banking detail the same as previously saved?
                </label>
              </div>


              {bankdetail ? (
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-2">Saved Bank Addresses</h4>
                  {uniqueAddresses2.length > 0 ? (
                    uniqueAddresses2.map((billing, index) => (
                      <div key={billing._id} className="mb-4 p-4 border rounded shadow-sm bg-gray-50">
                        <div className="flex items-center justify-between mb-2">

                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="billingAddressSelection"
                              checked={SelectedBillingAddress?.addressBillingIndex === index}
                              onChange={() => handleSelectBilling(index)}
                            />
                            Select this bank
                          </label>


                          <button
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => {

                              const updatedAddresses = uniqueAddresses2.filter((_, i) => i !== index);
                              setUniqueAddresses2(updatedAddresses);


                              if (SelectedBillingAddress?.addressBillingIndex === index) {
                                setSelectedBillingAddress(null);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>

                        <div className="text-sm text-gray-700 space-y-1">
                          <p><strong>Name:</strong> {billing.Name}</p>
                          <p><strong>Account Number:</strong> {billing.accountNumber}</p>
                          <p><strong>Bank Name:</strong> {billing.bankName}</p>
                          <p><strong>IFSC Code:</strong> {billing.ifscCode}</p>
                          <p><strong>Branch:</strong> {billing.branch}</p>
                          <p><strong>SWIFT Code:</strong> {billing.swiftcode}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No saved bank details found.</p>
                  )}
                </div>
              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Name", "accountNumber", "bankName", "ifscCode", "branch", "swiftcode"].map((name) => (
                    <input
                      key={name}
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={name.replace(/([A-Z])/g, " $1").trim()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                  ))}


                  <div className="col-span-full">
                    <button
                      onClick={() => {

                        setUniqueAddresses2((prev) => [...prev, formData]);


                        setFormData({
                          Name: "",
                          accountNumber: "",
                          bankName: "",
                          ifscCode: "",
                          branch: "",
                          swiftcode: "",
                        });


                        setbankdetail(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-10 text-xs">
            <div className="w-2/3">
              <strong>Declaration</strong><br />
              We declare that this invoice shows the actual<br />
              price of the goods described and that<br />
              all particulars are true and correct.
            </div>
            <div className="w-1/3 text-right">
              <b>{invoice.billBranch}</b><br /><br /><br />
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addinvoice;







