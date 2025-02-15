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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
      <Card className="w-full max-w-6xl shadow-xl border-none">
        <CardHeader className="text-center font-mono">
          <CardTitle className="text-2xl font-bold">A Map of Me</CardTitle>
          <CardDescription>
            {hoveredItem ? (
              <p className={`${isPOI(hoveredItem) && 'text-blue-500 font-bold'}`}>{hoveredItem}</p>
            ) : (
              <p>
                Hover over a <span className="font-bold text-blue-300 hover:text-blue-500">highlighted</span> country to find out more!
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
        <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} className="border rounded-lg">
          <ZoomableGroup zoom={1.1} center={ [12, 0] }>
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
                      className={`outline-none stroke-gray-300 stroke-[0.5px] transition-all duration-200
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
                onMouseEnter={() => setHoveredItem(label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <circle r={4} className="fill-red-500" />
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  className={`font-mono font-bold text-xs select-none ${hoveredItem === label || hoveredItem === country ? "fill-red-500" : ""}`}
                >
                  {label}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        </CardContent>
        <CardFooter className="font-mono text-sm text-muted-foreground flex flex-col items-center">
          <p className="italic select-none">Drag the map to move and scroll to zoom.</p>
          <HoverCard open={!!hoveredItem && !!getPOI(hoveredItem)}>
            <HoverCardTrigger/>
            <HoverCardContent className="w-96 font-mono" side="top">
              {hoveredItem && getPOI(hoveredItem) && (
                <div>
                  <h3 className="text-lg font-semibold ml-1">{getPOI(hoveredItem)?.label}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {getPOI(hoveredItem)?.city}, {getPOI(hoveredItem)?.country}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{getPOI(hoveredItem)?.desc}</p>
                </div>
              )}
            </HoverCardContent>
          </HoverCard>
        </CardFooter>
      </Card>
      <p className="text-sm text-muted-foreground italic absolute bottom-5 select-none font-mono">By Brandon Tan</p>
    </div>
  )
}

