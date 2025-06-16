import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from "../reducers/commonReducer";
import { Link } from 'react-router-dom';
// import LoginPop from './LoginPop';

const PricingPlans = () => {
  const token = localStorage.getItem('x-auth-token');
  const [activeTab, setActiveTab] = useState("ITR");
  const [showExtra, setShowExtra] = useState(false);
  const extraRef = useRef(null);

  const dispatch = useDispatch();
  const { getProductsData } = useSelector((state) => state.commonReducer);

  useEffect(() => {
    let timeout = setTimeout(() => {
      dispatch(getProducts({}));
    }, 800);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  useEffect(() => {
    if (showExtra && extraRef.current) {
      setTimeout(() => {
        extraRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showExtra]);

  const gstPlans = getProductsData?.list?.filter(plan => plan?.category?.shortName === "GST") || [];
  const itrPlans = getProductsData?.list?.filter(plan => plan?.category?.shortName === "ITR") || [];

  const displayedPlans = activeTab === "ITR" ? itrPlans.slice(0, 3) : gstPlans.slice(0, 3);
  const extraPlans = activeTab === "ITR" ? itrPlans.slice(3) : gstPlans.slice(3);

  const discountType = getProductsData?.discountType;
  const discountAmount = getProductsData?.discountAmount || 0;

  return (
    <div className="container text-center my-5">

      <div className="btn-group mb-4" role="group">
        <button
          className={`btn btn1 ${activeTab === "ITR" ? "btn-primary" : ""}`}
          onClick={() => { setActiveTab("ITR"); setShowExtra(false); }}
        >
          ITR Plans
        </button>
        <button
          className={`btn btn1 ${activeTab === "GST" ? "btn-primary" : ""}`}
          onClick={() => { setActiveTab("GST"); setShowExtra(false); }}
        >
          GST Plans
        </button>
      </div>

      <h2 className="fw-bold mt-2">Pricing tailored for you</h2>
      <p className="text-primary fw-semibold">File taxes with a tax professional</p>

      {/* Main Plans */}
      <div className="row mt-4 justify-content-center">
        {displayedPlans.map((data, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="plan-card h-100">
              <div className="plan-title">{data?.name}</div>
              <p className="plan-desc">{data?.description}</p>
              <hr />
              <div className="price-block my-3">
                <del>₹{data?.mrp}</del> &nbsp;

                {discountType === "amount" ? (
                  <>
                    <strong style={{ textDecoration: 'line-through', color: 'red' }}>₹{data?.sale}</strong> &nbsp;
                    <strong>₹{data?.sale - discountAmount}</strong>
                  </>
                ) : discountType === "percentage" ? (
                  <>
                    <strong style={{ textDecoration: 'line-through', color: 'red' }}>₹{data?.sale}</strong> &nbsp;
                    <strong>₹{data?.sale - (data?.sale * discountAmount / 100)}</strong>
                  </>
                ) : (
                  <strong>₹{data?.sale}</strong>
                )}


                <div className="text-muted" style={{ fontSize: "13px" }}>+ Taxes</div>
              </div>
              {/* {token ? (
                <Link to={`/plans-details?id=${data?.id}`}> */}
                  <button className="btn btn-primary2 w-100">Buy now</button>
                {/* </Link>
              ) : (
                <LoginPop title="Buy now" id={data?.id} />
              )} */}
            </div>
          </div>
        ))}
      </div>

      {extraPlans.length > 0 && (
        <div className="mt-3 mb-2">
          <p
            className="text-primary fw-medium"
            style={{ fontSize: '14px', cursor: 'pointer' }}
            onClick={() => setShowExtra(!showExtra)}
          >
            Tap to {showExtra ? 'hide' : 'see more'} plans
            <i className={`bi ms-1 ${showExtra ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
          </p>
        </div>
      )}

      {showExtra && (
        <div ref={extraRef} className="row mt-4 justify-content-center">
          {extraPlans.map((data, index) => (
            <div className="col-md-4 mb-4" key={`extra-${index}`}>
              <div className="plan-card h-100">
                <div className="plan-title">{data?.name}</div>
                <p className="plan-desc">{data?.description}</p>
                <hr />
                <div className="price-block my-3">
                  <del>₹{data?.mrp}</del> &nbsp;
                  {discountType === "amount" ? (
                    <>
                      <strong style={{ textDecoration: 'line-through', color: 'red' }}>₹{data?.sale}</strong> &nbsp;
                      <strong>₹{data?.sale - discountAmount}</strong>
                    </>
                  ) : discountType === "percentage"? (
                    <>
                      <strong style={{ textDecoration: 'line-through', color: 'red' }}>₹{data?.sale}</strong> &nbsp;
                      <strong>₹{data?.sale - (data?.sale * discountAmount / 100)}</strong>
                    </>
                  ) : (
                    <strong>₹{data?.sale}</strong>
                  )}
                  <div className="text-muted" style={{ fontSize: "13px" }}>+ Taxes</div>
                </div>
                {/* {token ? (
                  <Link to={`/plans-details?id=${data?.id}`}> */}
                    <button className="btn btn-primary2 w-100">Buy now</button>
                  {/* </Link>
                ) : (
                  <LoginPop title="Buy now" id={data?.id} />
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
 