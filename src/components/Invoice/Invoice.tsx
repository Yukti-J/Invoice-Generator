import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInvoice } from "../../invoiceSlice";
import "./Invoice.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../assets/logo.png";


interface Product {
  _id: string;
  productName: string;
  productQuantity: number;
  productRate: number;
  productTotal: number;
}

const Invoice = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: any) => state.userId.userId);
  const dispatch = useDispatch();
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const invoiceId = useSelector((state: any) => state.Invoice.invoiceId);
  const newval = 323090;

  const [productName, setProductName] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [productRate, setProductRate] = useState<number>(0);
  const [productList, setProductList] = useState<Product[]>([]);
  const [showProduct, setShowProduct] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    if (userId === "") {
      navigate("/");
    }
  }, [navigate, userId]);

  useEffect(() => {
    updateTotals();
  }, [productList]);

  const updateTotals = () => {
    let totalAmount = 0;
    productList.forEach((product) => {
      totalAmount += product.productTotal;
    });
    const gst = totalAmount * 0.18;
    setTotal(totalAmount);
    setGrandTotal(totalAmount + gst);
    console.log(total, grandTotal)
  };

  const getProducts = async () => {
    const response = await fetch(
      `https://invoice-generator-server-nmky.onrender.com/${invoiceId}/getProducts`,
      {
        method: "GET",
      }
    );
    const products: Product[] = await response.json();
    console.log(products);
    setProductList(products);
  };

  const handleInvoice = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const userDataId = { userId };
    try {
      const response = await fetch(`https://invoice-generator-server-nmky.onrender.com/createInvoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataId),
      });
      if (response.status === 201) {
        const invoice: Product[] = await response.json();
        dispatch(setInvoice(invoice[invoice.length - 1]._id));
        setInvoiceCreated(true);
      }

      if (response.status === 409) {
        const responseData = await response.json();
        alert(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProduct = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const productData = {
      invoiceId,
      productName,
      productQuantity,
      productRate,
    };
    try {
      const response = await fetch(`https://invoice-generator-server-nmky.onrender.com/createProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      console.log(response.status);
      if (response.status === 200) {
        const products: Product[] = await response.json();
        console.log(products);
        console.log("running");
        setProductName("");
        setProductQuantity(0);
        setProductRate(0);
        setShowProduct(false);
        getProducts();
      }

      if (response.status === 500) {
        await response.json().then((response) => alert(response.mssg));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateInvoice = async (invoiceId: string, subTotal: number, grandTotal: number) => {
    const invoiceData = { invoiceId, subTotal, grandTotal };
    console.log(invoiceData)
    try {
      const response = await fetch(`https://invoice-generator-server-nmky.onrender.com/updateInvoice`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        
        credentials: "include",
        body: JSON.stringify(invoiceData),
      });
  
      if (response.ok) {
        console.log("Invoice updated successfully");
      } else {
        // Handle non-successful responses
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || 'Failed to update invoice');
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      // Handle or display the error message here
    }
  }
  

  const download = () => {
    updateInvoice(invoiceId, newval, grandTotal)
    const domElement = document.getElementById("previewSection");
    if (domElement) {
      html2canvas(domElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF(); // Corrected import name to 'jsPDF'
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "JPEG", 0, 0, width, height);
        pdf.save("invoice.pdf");
      });
    } else {
      console.error("Page element not found");
    }
  };


  return (
    <div>
      <div className="main" id="main">
        <div className="inputSection">
          {!invoiceCreated && (
            <button
              className="btn invoice-btn"
              onClick={(e) => handleInvoice(e)}
            >
              Create Invoice
            </button>
          )}

          {invoiceCreated && (
            <div className="products">
              <div className="heading">
                <div className="name">Product name</div>
                <div className="quantity">Quantity</div>
                <div className="rate">Rate</div>
              </div>

              {productList.map((product, index) => (
                <div className="heading productList" key={index}>
                  <div className="name">{product.productName}</div>
                  <div className="quantity">{product.productQuantity}</div>
                  <div className="rate">{product.productRate}</div>
                </div>
              ))}

              <div className="heading btnhead">
                <button
                  className="pro-btn"
                  onClick={() => setShowProduct(true)}
                >
                  Add Product
                </button>
              </div>
              <div className="heading btnhead">
                <button className="pro-btn" onClick={download} id="down-btn">
                  Generate Invoice
                </button>
              </div>

              {showProduct && (
                <div className="heading addProduct">
                  <input
                    className="name"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                  <input
                    className="quantity"
                    type="number"
                    placeholder="Quantity"
                    value={productQuantity}
                    onChange={(e) =>
                      setProductQuantity(parseInt(e.target.value))
                    }
                    required
                  />
                  <input
                    className="rate"
                    type="number"
                    placeholder="Rate"
                    value={productRate}
                    onChange={(e) => setProductRate(parseInt(e.target.value))}
                    required
                  />
                  <button
                    className="add-btn"
                    onClick={(e) => handleAddProduct(e)}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="previewSection" id="previewSection">
          <div className="previewProducts">
            <div className="nav-navbar">
              <div className="nav-title2">INVOICE GENERATOR</div>
              <div className="nav-logo">
                <img src={logo} className="nav-logoImage" alt="Logo" />
                <div className="nav-title">
                  <h4>levitation</h4>
                  <p>infotech</p>
                </div>
              </div>
            </div>

            <div className="pre-heading">
              <div className="name">Product</div>
              <div className="quantity">Qty</div>
              <div className="rate">Rate</div>
              <div className="rate">Total</div>
            </div>

            <div className="productsMap">
              {productList.map((product, index) => (
                <div className="pre-heading pre-productList" key={index}>
                  <div className="name">{product.productName}</div>
                  <div className="quantity">{product.productQuantity}</div>
                  <div className="rate">{product.productRate}</div>
                  <div className="rate">INR {product.productTotal}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="total">
            <div className="subTotal sec-total">
              <p>
                <b>Total</b>
              </p>
              <p>INR {total}</p>
            </div>
            <div className="gst sec-total">
              <p>GST</p>
              <p>18%</p>
            </div>
            <div className="grandTotal sec-total">
              <p>
                <b>Grand Total</b>
              </p>
              <p>INR {grandTotal}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
