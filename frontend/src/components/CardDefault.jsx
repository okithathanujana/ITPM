import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const CARDS = [
  {
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    title: "Prescription Medicines",
    description: "Get your prescribed medications delivered right to your doorstep. We ensure safe and secure handling of all prescription drugs.",
  },
  {
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    title: "Healthcare Products",
    description: "Browse our wide range of healthcare products, from vitamins and supplements to personal care items.",
  },
  {
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    title: "Professional Consultation",
    description: "Get expert advice from our licensed pharmacists about your medications and health concerns.",
  }
];

export function CardDefault({ index = 0 }) {
  const card = CARDS[index];

  return (
    <Card className="mt-6 w-96">
      <CardHeader color="blue-gray" className="relative h-56">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {card.title}
        </Typography>
        <Typography>
          {card.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button className="bg-[#2563eb] text-white hover:bg-blue-700">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}