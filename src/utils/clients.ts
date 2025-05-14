const RAMDOR = "ramdor";
const JM = "jm";
const GREENBOOK = "greenbook";
const EXPONET = "exponet";
const NA = "NA";

interface SupportDetails {
  mail: string;
  phone: string;
}

const isExponetUrl = () => window.location.href.includes(EXPONET);

const supportInfo = (client: string): SupportDetails => {
  if (client === RAMDOR || client === JM) {
    return {
      mail: "rmsupp@ramdor.co.il",
      phone: "03-7667777",
    };
  } else {
    return {
      mail: "info@castory-ai.com",
      phone: "+972-509765411",
    };
  }
};

const isReseller = (client?: string) => client === JM || client === RAMDOR;

export {
  RAMDOR,
  GREENBOOK,
  EXPONET,
  JM,
  NA,
  supportInfo,
  isExponetUrl,
  isReseller,
};
