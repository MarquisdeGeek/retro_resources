function jswDigraph() {
	var di = new digraph();

	di.setOption('rankdir', 'LR');
	di.traverse(35, { useGraphics:false, rooms: [] }, jsw_builder);

	return di.generateDot();
}

function jsw_builder(jswRoomIdx, data, handler) {
	if (typeof jswRoomIdx === 'undefined' || jswRoomIdx === 47) {
		return;
	}

	if (data.rooms[jswRoomIdx]) {
		return data.rooms[jswRoomIdx].diNode;
	}

	var room = gVars.jsw.getRoom(jswRoomIdx);
	var node = handler.addNode();

	if (data.useGraphics) {
		var filename = "000" + jswRoomIdx;
		filename = filename.substr(filename.length-3);
		node.setLabelImage('images/named/' + filename + '.png');
	} else {
		node.setLabelText(room.name.trim());
	}
	data.rooms[jswRoomIdx] = room;
	data.rooms[jswRoomIdx].diNode = node;

	var dirname = ["", "up", "down","right","left"];
	for(var connect=1;connect<=4;++connect) {
		var neighbor_idx = room.rooms[connect];
		// We decide to recurse ourselves, rather than let the library handle them.
		// This only works because we know *this* data set won't explode the stack!
		var neighbor_node = jsw_builder(neighbor_idx, data, handler);
		
		if (neighbor_node) {
			handler.addConnection(node, neighbor_node, dirname[connect]);
		}
	}
	return node;
}
