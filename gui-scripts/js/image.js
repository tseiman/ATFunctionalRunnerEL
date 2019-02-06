/**
 * http://usejsdoc.org/
 */

class Image {
	
	constructor(name, dom,append_to_id) {
		var apped_to = (append_to_id === undefined) ? "#space" : append_to_id;
		this.name = name;
//		this.src = dom.evaluate( './/image[@name="' + name + '"]/@src', dom, null, XPathResult.STRING_TYPE, null ).stringValue;

		this.src = dom.evaluate( './/image[@name="' + name + '"]/@src', dom, null, XPathResult.STRING_TYPE, null ).stringValue;
//		console.log({src: this.src});
	
		
		this.imgDataB64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABF5JREFUaAXtWltIVEEYnjm77naljOz+EBVmrLfNwhAKupIRlFF2wdQeMuzyUhBBRUEvQRBFD9VTdKfEosCHTM1eIiFolSwpgm4vISGVurq750zfXzsiu2ePZ0/Hdo09MP7z/zPzz/fN/885O+fImcFVeastS1PZKoMulps0xr68PL29gRy0t7d3W3XkNBqoCraEc37BqI/VNkWwp2lpaT4hxM3CwsLilpaWH1Z8KVYG2TkGBIp6e3vrCwoKJljxm3ACBBpRLgwGgw05OTnp8ZJICgJh0IsgGz0ez6R4SCQTAYqE1+l0NiGdJpslkVQECDT2RF5/f/+T3NzcKWZIJB0BAq0oSjZEM9Jp2lAkkpJAGPQCh8PR7PV6ZxiRSGYChHu+pmlPkU6zYpEwfJDFGmSXHbfOH1jl80b+sCdoc5egj+4DNWEEVC4me4/cXgZgzUYEZFumu8NRU1qqSl3KhBFwMO5hnN2XQIaSo/rmj0Ofnsh+yb4HIvFG6SOGwGh/UEShh2HEENADT7YUgVgrY7e9Kz2QSiG7F9UWfyNmD4ztmZ5KIVtCbreTEZNC46eG/s8UMvwxxwULMI19tzvsmqKNV3DussMvt8NJvD4qbry6IpiojGec36W4a0o9gcgxuhGgl0w4WH+M7GyHjsPJRS7EVcFZpR3+dAmoqspxsLb0pswEqMoP72uPz5y3+YODidkm+ht2sSUPDWeIbpz2rbZ2jcK0G9FNsS3pXX7rdyGcS/ejlFBBChzCNN9oKtSrYauT06JehkN4J+moN6GsQySXQ16WfcKywsGd1yJsllSzEWgE2E0AcgoAA6jvptlCoVADAO5B9SfpOKDXQe9F9T36bEf9GA7ulzHuDGyN1IcutG3wndkBouqzPxbrf80SoBnmAFB2mMg7OSXAZaGckDpJkKyHbTVKEUhlYswD2LIG9XGjbSsTiukovM38aT2FaGKAOAuxD0Bo9avJFr6Oglgd2lulATpFaTTpkJRyl2DrkO1hWa6E1Dsa0/oi7HGppiOAFVsKz5RG9FVlr5wF+hiUcyBW7Xa78eHldwRcsFEqUTS2gcQnVH2kywvtRb7zuzLwQHsobVakaQJwvhhlJVJits5ExQA5U35lwWqvwVvmxwDZDDu93+yGjJoL7eWCi6s6/qJMGZ2df5VCK+Ex6r09QK7CCqfTbJDn8IFiI+QYqHPxLLkP0GcBsgz6EuhV1G/whbadn9/dq+ca+zrYHk9d96dEfn7+RADpiseR1b4guSLv8M31uO8eNPLhd71x6r2ZiwqrkZPhaEMUKpiJNPK83qKbQro/JbD6QZRHwwE40if2y9hrO3JelV1v9SlcyY9sH0rXJdDW1kbvINdW3X0xIRByTR/Kyd+2L2QsUxNKE9LIHgISkD/oKuGCX5H68ErdDBmY8uQJJtjJAXWgkvA9MIDEYiVFwOLCxT+M44Crc6UioLMo/9SkexuVCBycPdc0cUDqiZKC439bYly/AOjagQUQRBsFAAAAAElFTkSuQmCC";

		if(this.src != null && this.src !== "") {
			this.imgDataB64 = base64ArrayBuffer(this.src);
		}
		
//		console.log({loadImg: "loadImg2", imgData: this.imgDataB64});		
		
		$(apped_to).append('<div class="dragable button-wrap"><img id="img_' + name +'" src="' + this.imgDataB64 + '" /></div>')
		
	}
	
	update(data) {
//		console.log({img: "update", data: data});		
		$('#img_' + this.name).attr("src", data);
	}
	
	
	
}


