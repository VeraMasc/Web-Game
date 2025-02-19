import { World } from '../World/world';

/**Render function for the game world */
export function RenderWorld(){
    
    return <div className="worldMap">
            {World.instance?.currentLocation?.toRender()}
        </div>
}