import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Slider() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const imageSlider = [
    "/sidebar/sidebar.png",
    "/sidebar/sidebar2.png",
    "/sidebar/sidebar3.png",
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full">
      <CarouselContent>
        {imageSlider.map((src, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden rounded-none py-0 border-none">
              <CardContent className="p-0 h-full md:h-[450px] lg:h-[600px]">
                <img
                  src={src}
                  alt={`slide-${index}`}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
