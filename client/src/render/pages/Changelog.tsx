import { changeLog } from "../assets/changelog"
import { ChangeLogVersion } from "../components/ChangeLogVersion"

export const Changelog = () => {
  return (
    <div>
      {changeLog.map(change => (
        <ChangeLogVersion key={change.date} item={change} />
      ))}
    </div>
  )
}
