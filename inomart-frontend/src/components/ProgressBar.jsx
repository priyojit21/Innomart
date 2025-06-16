import React from "react";
import { Steps } from "antd";
import Logo from "../components/Logo";

const ProgressBar = ({ currentStep }) => {

  return (
    <>
      <div className="px-[39px] py-[50px] hidden lg:block">
        <div className="mb-[97.97px]">
          <Logo />
        </div>

        <Steps
          className="flex"
          direction="vertical"
          current={currentStep}
          status="process"
          items={[
            {
              title: "Basic Account Info.",
              description: (
                <div className="pb-[28px]">The order needs to be accepted</div>
              ),
            },
            {
              title: "Business Information",
              description: (
                <div className="pb-[28px]">The order needs to be accepted</div>
              ),
            },
            {
              title: "Payment & Financial",
              description: (
                <div className="pb-[28px]">
                  The order is accepted by the seller
                </div>
              ),
            },
            {
              title: "Store Setup & Policies",
              description: (
                <div className="pb-[28px]">The order needs to be accepted</div>
              ),
            },
            {
              title: "Verification Documents",
              description: (
                <div className="pb-[28px]">
                  The delivery boy will come to pick up
                </div>
              ),
            },
            {
              title: "Agreement & Consent",
              description: (
                <div className="pb-[28px]">
                  The order is accepted by the seller
                </div>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default ProgressBar;
