import { ReactNode } from "react";

const Banner = ({ info, icon }: { info: string; icon: ReactNode | null }) => {
  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center gap-2 rounded-xl bg-[#2980b9] p-3 text-left text-sm xxs:text-md xs:text-lg font-medium text-white">
        {icon && <span>{icon}</span>}
        <p className="m-0">{info}</p>
      </div>
    </div>
  );
};

export default Banner;
