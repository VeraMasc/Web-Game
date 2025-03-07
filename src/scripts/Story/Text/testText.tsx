import { renderToString } from 'react-dom/server';
import { StoryArray, TaggedArray, Tag } from '../StoryElements';
import { Choice } from '../StoryEvents';



/**Story to test features */
export var testStory = ()=>[
    // "This is a test story",
    // "[Blue:]{color:dodgerblue;} Title test", //Title test
    // `[]Skip title test`,
    // `[\\]Escaped title chars[] Text starts here`, //Escape title test
    // `[Rare char test]{color:goldenrod;} ö à ñ`,
    // `[Html test:] ${renderToString(<><i>italic</i> <hr/> hr <b>bold</b> <br/> newline <small>small</small></>)}`,
    // `[Table test:]{color:dodgerblue;}${renderToString(<div>
    // <table className='retroTable'>
    //     <tr>
    //         <th>Company</th>
    //         <th>Contact</th>
    //         <th>Country</th>
    //     </tr>
    //     <tr>
    //         <td>Alfreds Futterkiste</td>
    //         <td>Maria Anders</td>
    //         <td>Germany</td>
    //     </tr>
    //     <tr>
    //         <td>Centro comercial Moctezuma</td>
    //         <td>Francisco Chang</td>
    //         <td>Mexico</td>
    //     </tr>
    // </table> 
    // </div>)}`,
    "[Choice tests:] Starting",
    new Choice("Option 1", "Option 2"),
    "You should not be able to read this"
] as StoryArray


export var placeHolder = ()=>[
    "This is a test",
    "<<span style=\"color:dodgerblue;\">System:</span>> Initializing^1000.^1000.^1000.",
    "<<span style=\"color:dodgerblue;\">System:</span>> System compromised!^1000 Initiating damage recovery",
    ([new Tag(""), "Tagged"] as TaggedArray)
] as StoryArray