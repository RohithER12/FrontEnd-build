import { Suspense,lazy } from 'react';
import HomeSkeleton from '../../components/ShimmerForHome/HomeSkeleton';


const RoomContainer = lazy(()=> import("../../components/RoomContainer/RoomContainer"))
const StreamContainer = lazy(()=> import("../../components/StreamedVideos/StreamedVideos"))
const ExclusiveContainer = lazy(()=> import("../../components/StreamedVideos/ExclusiveVideos"))


const Home = ()=>{
    return (
        <div className='h-full  w-full max-w-screen-xl'>
            <Suspense fallback={<HomeSkeleton/>}>
                <RoomContainer/>
            </Suspense>
            <Suspense fallback={<HomeSkeleton/>}>
                <StreamContainer/>
            </Suspense>
            <Suspense fallback={<HomeSkeleton/>}>
                <ExclusiveContainer/>
            </Suspense>
        </div>
       
    )

}

export default Home;