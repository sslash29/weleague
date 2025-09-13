"use client";

import Accordion from "./Dropdown";

function FAQ() {
  return (
    <div className="flex flex-col gap-8">
      <Accordion
        header={"is this for all we schools"}
        bodyText={
          "Short answer is No!, it's only avaliable for we nasr school, the reason being it's not devloped by the school it was developed by a person in we nasr, there may be a possibility it will come to other schools"
        }
      />
      <Accordion
        header={"will this be available for we super league"}
        bodyText={
          "we are working towards it being implemented in the super league but for now it will not be avaliable"
        }
      />
      <Accordion
        header={"Can I create multiple accounts"}
        bodyText={"No, cause we want each student to have one account"}
      />
    </div>
  );
}

export default FAQ;
