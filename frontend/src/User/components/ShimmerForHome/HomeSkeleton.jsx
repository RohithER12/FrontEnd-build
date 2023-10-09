import React from "react";
import {Card, Skeleton,Button} from "@nextui-org/react";



export default function HomeSkeleton() {
  return (
    <div className="grid gap-2 grid-cols-6 justify-between">
      {[1,2,3,4,5,6].map(x=>
      <div key={x}>
        <Card className="w-[300px] space-y-5 mt-4 ml-2 p-4" radius="2xl" key={x+1} >
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">  
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
          <Button
          >
          </Button>
        </Card>
    </div>
    )}
    </div>
      )
    
}
