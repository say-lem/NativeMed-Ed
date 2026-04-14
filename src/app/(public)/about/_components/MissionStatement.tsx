import Image from "next/image";

function MissionStatement() {
  return (
    <section>
      <div className="bg-black-others pt-10 sm:pt-12 lg:pt-20 text-center pb-20 sm:pb-32 md:pb-44 lg:pb-60 space-y-2.5 px-4 sm:px-8 md:px-0">
        <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[130%] tracking-[-2%] text-primary-white mt-3 capitalize">
          Mission Statement
        </h2>
        <p className="leading-[130%] md:leading-[120%] font-medium text-sm sm:text-base md:text-xl lg:text-2xl text-gray-1 mx-auto w-[92%] sm:w-[85%] md:w-[70%] lg:w-[60%]">
          &quot;Our mission is to empower doctors to excel in their careers by
          providing high-quality, affordable, and practical medical education.
          We are dedicated to fostering confidence, competence, and lifelong
          learning, ensuring that every doctor we teach is prepared to deliver
          compassionate, effective care to their patients&quot;.
        </p>
      </div>

      <div className="relative w-full h-[35vh] sm:h-[40vh] md:h-[50vh] lg:h-screen">
        <Image
          src="/Images/What we really do.svg"
          alt="Image of what we do"
          fill
          className="object-fill"
        />
      </div>
    </section>
  );
}

export default MissionStatement;
