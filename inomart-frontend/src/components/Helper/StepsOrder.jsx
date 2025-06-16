import React from "react";
import { Steps, Grid } from "antd";

const StepsOrder = ({ currentStep, setCurrentStep, statusOfStep }) => {
  const { xs, sm, md, lg } = Grid.useBreakpoint();

  const baseSteps = [
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          New Order
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          The order needs to be accepted
        </div>
      ),
    },
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Ready to Ship
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          The delivery boy will come to pickup
        </div>
      ),
    },
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Shipped
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          The order is accepted by the seller
        </div>
      ),
    },
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Out For Delivery
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          The order is out for delivery
        </div>
      ),
    },
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Delivered
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          Order has been successfully delivered
        </div>
      ),
    },
  ];

  const extraSteps = [
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Cancellation Initiated
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          Cancellation request initiated.
        </div>
      ),
    },
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Cancel
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          Your Order has been cancelled. Refund Initiated
        </div>
      ),
    },
    {
      title: (
        <span className="text-[#0C0C0C] font-man font-bold">
          Refund
        </span>
      ),
      description: (
        <div className="pb-[28px] font-medium text-[#707070] font-man">
          Your return request has been successfully processed.
        </div>
      ),
    },
  ];

  const stepsItems = currentStep > 4 ? [...baseSteps, ...extraSteps] : baseSteps;

  return (
    <div className="">
      <Steps
        className="flex"
        direction="vertical"
        current={currentStep}
        status={statusOfStep}
        items={stepsItems}
      />
    </div>
  );
};

export default StepsOrder;
