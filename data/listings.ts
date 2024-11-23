export type Listing = {
    id: string;
    title: string;
    distance: string;
    dates: string;
    price: number;
    location: string;
    imageUrl: string;
    renterType: "Rice Student" | string;
    isFavorite: boolean;
  };
  
  export const listings: Listing[] = [
    {
      id: "1",
      title: "Life Tower",
      distance: "1.2 miles away",
      dates: "August - May",
      price: 1350,
      location: "Houston, TX",
      imageUrl: "/cherry_house.jpeg",
      renterType: "Rice Student",
      isFavorite: true,
    },
    {
      id: "2",
      title: "The Nest on Dryden jawiojeiwoajeiwo",
      distance: "0.7 miles away",
      dates: "August - May",
      price: 1400,
      location: "Houston, TX",
      imageUrl: "/hobbit_house.jpeg",
      renterType: "Not Rice Student",
      isFavorite: true,
    },
    {
      id: "3",
      title: "The Nest on Dryden",
      distance: "0.7 miles away",
      dates: "August - May",
      price: 1400,
      location: "Houston, TX",
      imageUrl: "/hobbit_house.jpeg",
      renterType: "Rice Student",
      isFavorite: false,
    },
    {
      id: "4",
      title: "The Nest on Dryden",
      distance: "0.7 miles away",
      dates: "August - May",
      price: 1400,
      location: "Houston, TX",
      imageUrl: "/house1.jpeg",
      renterType: "Rice Student",
      isFavorite: false,
    },
    {
      id: "5",
      title: "The Nest on Dryden",
      distance: "0.7 miles away",
      dates: "August - May",
      price: 1400,
      location: "Houston, TX",
      imageUrl: "/house1.jpeg",
      renterType: "Not Rice Student",
      isFavorite: true,
    },
    {
      id: "6",
      title: "pretty house jeiwoajeiowjaoieaweiwoe",
      distance: "15.8 miles away",
      dates: "August - May",
      price: 1400,
      location: "Houston, TX",
      imageUrl: "/modern_house.jpeg",
      renterType: "Rice Student",
      isFavorite: true,
    },
    // Add more listings as needed
  ];