import { DefaultAccordion } from "../components/Accordion";
import { DefaultImg } from "../components/DefaultImage";
import { CardDefault } from "../components/CardDefault";

const HomeScreen = () => {
  return (
    <>
      <DefaultImg />

      {/* Cards section with title */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Services</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <CardDefault index={0} />
          <CardDefault index={1} />
          <CardDefault index={2} />
        </div>
      </div>

      <div className="mt-16">
        <DefaultAccordion />
      </div>
    </>
  );
};

export default HomeScreen;
