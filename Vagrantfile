# encoding: utf-8

Vagrant.configure("2") do |config|

	require 'rbconfig'
	is_windows = (RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/)

  configFiles = ['./config/environments/env.vagrant.sh', './config/local/env.local.sh']

  # Read in env variables
  env = Hash.new

  configFiles.each do |f|
  	next if !File.file?(f)
  	File.open(f) do |fp|
    	fp.each do |line|
      	line.chomp!
      	next if !(line.start_with?('export '))
      	key, value = line.gsub("export ", "").split("=")
      	env[key] = Integer(value) rescue value
      end
    end
  end

  config.vm.provider :virtualbox do |vb|
    vb.gui = true
    if env["VAGRANT_DISABLE_VTX"]
      vb.customize ["modifyvm", :id, "--hwvirtex", "off"]
    end
    vb.customize ["modifyvm", :id, "--cpuexecutioncap", env["VAGRANT_CPU_CAP"]]
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
    vb.memory = env["VAGRANT_MEMORY"]
    vb.cpus = env["VAGRANT_CPUS"]
  end

  config.vm.box = env["VAGRANT_BOX_NAME"]
  config.vm.box_url = env["VAGRANT_BOX_URL"]
  config.ssh.forward_agent = true

  config.vm.network :forwarded_port, guest: env["PORT"], host: env["VAGRANT_NODEJS_HOST_PORT"]
  config.vm.network :forwarded_port, guest: env["THROTTLE_PORT"], host: env["THROTTLE_PORT"]
  config.vm.network :forwarded_port, guest: env["PGPORT"], host: env["VAGRANT_PG_HOST_PORT"]
  config.vm.network :forwarded_port, guest: env["KLSG_LIVERELOAD_PORT"], host: env["KLSG_LIVERELOAD_PORT"]

  if Vagrant.has_plugin?("vagrant-cachier")
  	config.cache.scope = :box
  end

	# if !is_windows #(future)
  if env["VAGRANT_SHARE_MODE"] == "nfs"
    config.vm.synced_folder ".", "/vagrant", :nfs => true
    config.vm.network :private_network, ip: "10.11.12.13"
  end

  if env["VAGRANT_SHARE_MODE"] == "rsync"
    config.vm.synced_folder ".", "/vagrant", type: "rsync",
      rsync__exclude: [".git/", "node_modules"]
  end

  config.vm.provision "shell", path: "bin/scripts/vagrant-provision.sh"

end
