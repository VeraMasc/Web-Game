import { StoryArray, TaggedArray, Tag } from '../storyElement';

export var testSegment = ()=>[
    "This is a test",
    "<<span style=\"color:dodgerblue;\">System:</span>> Initializing^1000.^1000.^1000.",
    "<<span style=\"color:dodgerblue;\">System:</span>> System compromised!^1000 Initiating damage recovery",
    ([new Tag(""), "Tagged"] as TaggedArray)
] as StoryArray


