import React from "react";
import Navbar from "../../components/Navbar/Navbar";

import OnSale from "../../components/NFTDetail/OnSale";
import NFTInfo from "../../components/NFTDetail/NFTInfo";
import UnSoldOwner from "../../components/NFTDetail/UnSoldOwner";
import UnSold from "../../components/NFTDetail/UnSold";

import "./AvatarDetail.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import shop from "../../api/shop";
import { setNftDetailOne } from "../../store/modules/shop";

function AvatarDetail() {
  const location = useLocation();

  const dispatch = useDispatch();
  const nftDetailOne = useSelector((state) => state.nftDetailOne);

  const nftId = location.state.nftId
  useEffect(() => {
    shop
      .nftDetailOne(nftId)
      .then((result) => {
        console.log(result.data)
        dispatch(setNftDetailOne(result.data));
      })
      .catch((error) => {
        console.log("오류");
        console.log(error);
      });
  }, []);

  return (
    <div className="avatar-wrap">
      <Navbar />
      <div className="detail-content">
        <NFTInfo />
        {nftDetailOne.saled ? (
          <div className="sale-wrap">
            <OnSale />
          </div>
        ) : (
          <div className="sale-wrap">
            {/* <UnSoldOwner/> */}
            <UnSold />
          </div>
        )}
      </div>
    </div>
  );
}

export default AvatarDetail;
