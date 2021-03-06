package cmd.send.animal;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import java.nio.ByteBuffer;

public class ResponseAnimalHarvest extends BaseMsg {
	public int errNo;
    public ResponseAnimalHarvest(int errNo) {
        super(CmdDefine.ANIMAL_HARVEST, (short)0);
        this.errNo = errNo;
    }
    
    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(errNo);
        return packBuffer(bf);
    }
}
