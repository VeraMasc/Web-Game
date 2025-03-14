import { renderToString } from 'react-dom/server';
import { StoryArray, StoryFunction } from '../StoryElements';
import { TaggedArray, Tag } from "../FlowElements/FlowTags";
import { Choice } from "../Events/ChoiceEvent";
import { JumpTo, CallTo } from '../FlowElements/FlowControl';



/**Story to test features */
export var testStory = ()=>[
    // "This is a test story",
    // "[Blue:]{color:dodgerblue;} Title test", //Title test
    // "[Blue:]{color:dodgerblue;} Not blue", //Color test
    // `[]{--content-color:dodgerblue;}Skip title test (in blue)`,
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
    new Choice("Test Choices?","No")
        .add("Yes",{branch:testChoices}),
    new Choice("Test Branching?","No")
        .add("Yes",{branch:testBranching}),
    '[]{--content-color:red;}You should not be able to read this',
    
] as StoryArray

var testChoices = ()=>[
    "[Choice tests:] Starting",
    new Choice("Prompt",
        "Normal Option")
        .add("Never blocked (restart)",{ condition:true, branch:[new JumpTo(testStory)]})
        .add("window.testCond==true?",{condition:()=>window['testCond']})
        .add("blocked",{ condition:false})
        .thenDefault(["Option chosen (no restart)"])        
    ,
    "Next choice is empty:",
    new Choice(),
]


var testBranching:StoryFunction= ()=>[
    "[Branch tests:] Starting",
    ["Simple branch array","Branch ends"],
    [new Tag('testTag'), "Tagged branch starts here...", "...and ends here"],
    new Choice("Test tagged branch?")
        .add("Yes",{branch:new CallTo(null,'testTag')})
        .add("No")
    ,
    "[Branch tests:] End",
]

export var placeHolder = ()=>[
    "This is a test",
    "<<span style=\"color:dodgerblue;\">System:</span>> Initializing^1000.^1000.^1000.",
    "<<span style=\"color:dodgerblue;\">System:</span>> System compromised!^1000 Initiating damage recovery",
    ([new Tag(""), "Tagged"] as TaggedArray)
] as StoryArray