import { Card } from "@/components/ui/card";

const providers = [
  { name: "PRAGMATIC PLAY", games: 217, image: "provider-1.svg" },
  { name: "POCKET GAMES SOFT", games: 137, image: "provider-2.svg" },
  { name: "BGAMING", games: 79, image: "provider-3.svg" },
  { name: "RED TIGER", games: 44, image: "provider-4.svg" },
  { name: "NETENT", games: 108, image: "provider-5.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-6.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-7.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-8.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-9.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-10.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-11.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-12.svg" },
  { name: "PLATIPUS", games: 66, image: "provider-13.svg" },
];

const ProviderCard = ({ image }) => (
  <Card className="w-102 h-55 transition-all duration-300 group">
    <div className="p-2 h-full flex flex-col justify-between">
      <div className="flex-1 relative">
        <img
          src={`/assets/elements/${image}`}
          alt=""
          className="w-full h-full"
        />
      </div>
    </div>
  </Card>
);

export const ProviderSlider = () => {
  return (
    <div className="w-full lg:my-5 overflow-hidden relative">
      <div className="flex animate-slide-step space-x-1">
        <div className="flex space-x-1 min-w-[calc(10rem*13)]">
          {providers.map((provider, index) => (
            <div key={index} className="flex justify-center">
              <ProviderCard {...provider} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
