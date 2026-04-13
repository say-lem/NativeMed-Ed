import Image from "next/image";

function MissionStatement() {
  return (
    <section>
      <div className="bg-blackOthers pt-12 md:pt-20 text-center pb-32 md:pb-60 space-y-2.5 px-4 md:px-0">
        <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl leading-[130%] tracking-[-2%] text-primary-white mt-3 capitalize">
          Mission Statement
        </h2>
        <p className="leading-[130%] md:leading-[120%] font-medium text-base sm:text-xl md:text-2xl text-gray1 mx-auto w-[90%] md:w-[60%]">
          “Our mission is to empower doctors to excel in their careers by
          providing high-quality, affordable, and practical medical education.
          We are dedicated to fostering confidence, competence, and lifelong
          learning, ensuring that every doctor we teach is prepared to deliver
          compassionate, effective care to their patients”.
        </p>
      </div>

      <div className="relative w-full h-[50vh] md:h-screen">
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
