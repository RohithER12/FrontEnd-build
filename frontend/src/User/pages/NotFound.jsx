
import { Link } from "react-router-dom";

const NotFound = ()=>{
    return (
        <section className="my-28 mb-44 dark:bg-gray-900 items-center justify-center">
        <div className="px-4 mx-auto max-w-screen-xl lg:pt-0">
          <div className="flex flex-col h-[35rem] items-center justify-center lg:flex-row lg:justify-center">
            <div className="text-center mt-32 lg:mt-0 lg:pr-10 ">
              <h1 className="text-2xl font-bold">Uh-oh! What you are looking for seems to have moved from here</h1>
              <Link to='/' className="btn border-t-indigo-500 text-blue-500">Home</Link>
            </div>
            <div className="w-full lg:w-1/2 lg:my-0 md:my-5">
              <img
                className="w-full h-auto my-20 mb-10 lg:my-0 md:my-5 lg:max-w-lg mx-auto"
                src="https://res.cloudinary.com/dcv6mx1nk/image/upload/v1696597166/cvvprsvs1razx3mzymhr.svg"
                alt="svg logo"
              />
            </div>
          </div>
        </div>
      </section>
    )
}

export default NotFound