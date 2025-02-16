"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PROFILE, HOBBIES, COURSES, EXPERIENCE } from "./text"

export default function AboutMe() {
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  const [hoveredItem, setHoveredItem] = useState();

  const POIS = [
    {
      label: "About Me",
      desc: PROFILE,
      country: "United States of America",
      city: "New York",
      coordinates: [-74.006, 40.7128],
      markerOffset: 20,
    },
    {
      label: "Hobbies",
      desc: HOBBIES,
      country: "Brazil",
      city: "Sao Paulo",
      coordinates: [-46.6396, -23.5558],
      markerOffset: -15,
    },
    {
      label: "Courses",
      desc: COURSES,
      country: "China",
      city: "Beijing",
      coordinates: [116.4074, 39.9042],
      markerOffset: 20,
    },
    {
      label: "Experience",
      desc: EXPERIENCE,
      country: "Australia",
      city: "Sydney",
      coordinates: [151.2093, -33.8688],
      markerOffset: -15,
    },
  ]

  const isPOI = (currName) => POIS.some(obj => obj.country === currName);
  const getPOI = (currName) => POIS.find(obj => obj.country === currName || obj.label === currName);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-6xl shadow-xl border-none">
        <CardHeader className="text-center font-mono pb-0">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">A Map of Me</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {hoveredItem ? (
              <p className={`${isPOI(hoveredItem) && 'text-blue-500 font-bold'}`}>{hoveredItem}</p>
            ) : (
              <p>
                Hover over a <span className="font-bold text-blue-300 hover:text-blue-500 transition-colors duration-300">highlighted</span> country to find out more!
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2 pb-0">
          <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-lg border">
            <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} className="w-full h-full">
              <ZoomableGroup zoom={1.5} center={[12, 0]}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.name
                      const isHighlighted =
                        hoveredItem === countryName ||
                        (isPOI(countryName) && POIS.some((poi) => poi.country === countryName && poi.label === hoveredItem))
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className={`outline-none stroke-gray-300 stroke-[0.5px] transition-colors duration-300
                              ${isPOI(countryName) ? isHighlighted ? 'fill-blue-400' : 'fill-blue-200': 'fill-gray-100 hover:fill-gray-200'}
                            `}
                          onMouseEnter={() => setHoveredItem(countryName)}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                      )
                    })
                  }
                </Geographies>
                {POIS.map(({ label, coordinates, markerOffset, country }) => (
                  <Marker
                    key={label}
                    coordinates={coordinates}
                    onMouseEnter={() => setHoveredItem(country)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <circle r={4} className="fill-red-500" />
                    <text
                      textAnchor="middle"
                      y={markerOffset}
                      className={`font-mono font-bold text-[8px] sm:text-xs select-none ${hoveredItem === country ? "fill-red-500" : ""}`}
                    >
                      {label}
                    </text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </CardContent>
        <CardFooter className="font-mono text-xs sm:text-sm text-muted-foreground flex flex-col items-center pt-3 pb-1">
          <p className="italic select-none mb-2">Drag to move and scroll to zoom.</p>
          <HoverCard open={!!hoveredItem && !!getPOI(hoveredItem)}>
            <HoverCardTrigger />
            <HoverCardContent className="w-72 sm:w-80 md:w-96 font-mono" side="top">
              {hoveredItem && getPOI(hoveredItem) && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold ml-1">{getPOI(hoveredItem)?.label}</h3>
                  <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
                    {getPOI(hoveredItem)?.city}, {getPOI(hoveredItem)?.country}
                  </Badge>
                  <p className="text-xs sm:text-sm text-muted-foreground">{getPOI(hoveredItem)?.desc}</p>
                </div>
              )}
            </HoverCardContent>
          </HoverCard>
        </CardFooter>
      </Card>
      <footer className="text-xs sm:text-sm text-muted-foreground italic select-none font-mono mt-8">
        By Brandon Tan
      </footer>
    </div>
  )
}