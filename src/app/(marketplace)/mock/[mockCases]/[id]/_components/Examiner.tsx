import MockCasesBorder, { MockCasesPurpleBg } from "./MockCasesBorder";
import { MockHeaderText } from "./MockText";

export default function Examiner() {
  return (
    <>
      <MockHeaderText text="Marking Scheme" />

      <MockCasesBorder>
        <MockCasesPurpleBg>ddjj</MockCasesPurpleBg>
      </MockCasesBorder>
    </>
  );
}
